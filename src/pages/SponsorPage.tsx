import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { sponsorshipService, type SponsorshipInput } from '../services/sponsorshipApi';
import { messageOf } from '../utils/errorMessage';

export default function SponsorPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SponsorshipInput>({
    defaultValues: { title: '', artistName: '', imageUrl: '', description: '', licenseAgreed: false, goodsConsent: false },
  });
  const agreed = watch('licenseAgreed');
  const create = useMutation({
    mutationFn: sponsorshipService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-sponsorships'] });
      toast.success('신청했어요. 심사 결과는 마이페이지에서 볼 수 있어요.');
      navigate('/me?tab=sponsor');
    },
    onError: (e) => toast.error(messageOf(e)),
  });

  return (
    <section className="page" style={{ maxWidth: 560 }}>
      <form className="stack" onSubmit={handleSubmit((v) => create.mutate(v))} noValidate>
        <h1 className="h1" style={{ fontSize: 28 }}>작품 협찬 신청</h1>
        <p className="muted" style={{ margin: 0 }}>승인되면 작품이 갤러리와 추천 후보에 올라가요.</p>
        <div className="field">
          <label htmlFor="s-image">작품 이미지 주소 (https)</label>
          <input id="s-image" className="input" inputMode="url" placeholder="https://"
            {...register('imageUrl', { required: '이미지 주소를 입력해 주세요.', pattern: { value: /^https:\/\/\S+$/, message: 'https로 시작하는 주소만 쓸 수 있어요.' } })} />
          {errors.imageUrl && <span className="field-error">{errors.imageUrl.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="s-title">작품명</label>
          <input id="s-title" className="input" {...register('title', { required: '작품명을 입력해 주세요.', maxLength: { value: 200, message: '200자 이하' } })} />
          {errors.title && <span className="field-error">{errors.title.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="s-artist">작가명</label>
          <input id="s-artist" className="input" {...register('artistName', { required: '작가명을 입력해 주세요.', maxLength: { value: 100, message: '100자 이하' } })} />
          {errors.artistName && <span className="field-error">{errors.artistName.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="s-desc">작품 소개</label>
          <textarea id="s-desc" className="textarea" rows={4} {...register('description', { maxLength: { value: 2000, message: '2000자 이하' } })} />
        </div>
        <div className="notice" style={{ gap: 14 }}>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.6 }}>
            <input type="checkbox" style={{ width: 20, height: 20, margin: '2px 0 0', flexShrink: 0 }} {...register('licenseAgreed')} />
            <span><strong>(필수)</strong> 이 작품의 저작권이 저에게 있으며, ARTMO가 작품을 추천 카드에 사용하고 사용자가 SNS에 공유하는 것에 동의합니다.</span>
          </label>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.6 }}>
            <input type="checkbox" style={{ width: 20, height: 20, margin: '2px 0 0', flexShrink: 0 }} {...register('goodsConsent')} />
            <span><strong>(선택)</strong> 추후 굿즈(엽서·포스터) 제작·판매에 작품을 사용하는 것에 동의합니다. 조건과 수수료는 별도로 안내합니다.</span>
          </label>
        </div>
        <button type="submit" className="btn" disabled={!agreed || create.isPending}>
          {create.isPending ? '신청 중…' : agreed ? '신청하기' : '필수 동의 후 신청할 수 있어요'}
        </button>
      </form>
    </section>
  );
}
